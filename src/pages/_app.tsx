import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Title, Description, Meta } from '@/components'
import React from 'react'
import ProgressBar from '@badrap/bar-of-progress'
import { Router } from 'next/router'
import { ThemeProvider } from 'next-themes'

const progress = new ProgressBar({
  size: 2,
  color: '#22D3EE',
  className: 'bar-of-progress',
  delay: 100,
})

if (typeof window !== 'undefined') {
  progress.start()
  progress.finish()
}

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', () => {
  progress.finish()

  // Will not work if scroll is not on <html>
  window.scrollTo(0, 0)
})
Router.events.on('routeChangeError', progress.finish)

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).layoutProps?.Layout || React.Fragment
  const layoutProps = (Component as any).layoutProps?.Layout
    ? { layoutProps: (Component as any).layoutProps }
    : {}
  const meta = (Component as any).layoutProps?.meta || {}
  const description =
    meta.metaDescription ||
    meta.description ||
    'Achieve your goals with a community of passionate self-learners by joining the Coderplex Community'

  return (
    <ThemeProvider
      attribute="class"
      storageKey="nightwind-mode"
      defaultTheme="system" // default "light"
    >
      <QueryClientProvider client={queryClient}>
        <Provider session={pageProps.session}>
          <Title suffix="Coderplex Community">
            {meta.metaTitle || meta.title}
          </Title>
          <Description>{description}</Description>
          <Meta />
          <Layout {...layoutProps}>
            <Component {...pageProps} />
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default MyApp
