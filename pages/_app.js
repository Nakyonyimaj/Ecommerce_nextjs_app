import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { StoreProvider } from '../utils/Store';
import { useRouter } from 'next/router';
import data from '../utils/data';

function App({ Component, pageProps : {session,...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

function  Auth({children}){
  const router = useRouter();
  const {status, data:session} = useSession({
    required:true,
    onUnauthenticated(){
      router.push('/unauthorized?message=login required')
    }
  });
  if(status === 'loading'){
    return <div>...Loading</div>
  }
  return children;
}

export default App