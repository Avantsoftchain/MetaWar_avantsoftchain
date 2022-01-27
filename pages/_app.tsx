import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import type { AppProps } from 'next/app';

import Icon from 'components/ui/Icon';
import { appSetInstagramUrl, appSetIsRN, appSetLogo, appSetName, appSetTwitterUrl, appSetUrl } from 'redux/app';
import { wrapper } from 'redux/store';
import GlobalStyle from 'style/Global';
import theme from 'style/theme';
import { isServer } from 'utils/server';


import 'style/fonts.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


const MyApp = ({ Component, pageProps }: AppProps) => {
  const [cookiesConsent, setCookiesConsent] = useState<string | null>(null);
  const [hide, setHide] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setCookiesConsent(localStorage.getItem('cookiesConsent'));
  }, []);

  useEffect(() => {
    dispatch(appSetIsRN(Boolean(window.isRNApp)));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2ZD3ZDVEZD"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments)}
        gtag("js", new Date());
        gtag("config", "G-2ZD3ZDVEZD");
    `,
          }}
        ></script>
        {/* Tell the browser to never restore the scroll position on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        />
      </Head>
      <GlobalStyle />

      {!cookiesConsent && !hide && (
        <SCookiesWrapper>
          We use cookies.
          <SCookiesLink href="https://intercom.help/ternoa/fr/collections/2774679-legal">Learn more</SCookiesLink>
          <SClose
            onClick={() => {
              localStorage.setItem('cookiesConsent', 'true');
              setHide(true);
            }}
          >
            <Icon name="close" />
          </SClose>
        </SCookiesWrapper>
      )}

      <Component {...pageProps} />
    </ThemeProvider>
  );
};

MyApp.getInitialProps = wrapper.getInitialAppProps(store => async (context) => {
  if (isServer) {
    if (process.env.NEXT_PUBLIC_APP_LOGO_PATH) store.dispatch(appSetLogo(process.env.NEXT_PUBLIC_APP_LOGO_PATH));
    if (process.env.NEXT_PUBLIC_APP_NAME) store.dispatch(appSetName(process.env.NEXT_PUBLIC_APP_NAME));
    if (process.env.NEXT_PUBLIC_INSTAGRAM_LINK) store.dispatch(appSetInstagramUrl(process.env.NEXT_PUBLIC_INSTAGRAM_LINK));
    if (process.env.NEXT_PUBLIC_TWITTER_LINK) store.dispatch(appSetTwitterUrl(process.env.NEXT_PUBLIC_TWITTER_LINK));
    if (process.env.NEXT_PUBLIC_APP_LINK) store.dispatch(appSetUrl(process.env.NEXT_PUBLIC_APP_LINK));
  }

  try {
    const pageProps = {
      ...(await App.getInitialProps(context)).pageProps,
    };

    return { pageProps };
  } catch (err) {
    console.log(err);
    return { pageProps: {} };
  }
});

export default wrapper.withRedux(MyApp);

const SCookiesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.6rem 2.4rem;
  border-radius: 2.4rem;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.invertedContrast};
  position: fixed;
  z-index: 1000;
  bottom: 2px;
  left: 8%;
  background-color: ${({ theme }) => theme.colors.contrast};
  font-size: 1.2rem;

  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 4rem;
    left: 4rem;
  }
`;

const SCookiesLink = styled.a`
  color: ${({ theme }) => theme.colors.primary500};
  font-family: ${({ theme }) => theme.fonts.bold};
  margin-left: 0.8rem;
`;

const SClose = styled.button`
  cursor: pointer;
  margin-left: 1.6rem;

  svg {
    width: 1.2rem;
    height: 1.2rem;
    fill: ${({ theme }) => theme.colors.invertedContrast};
  }
`;
