import { getProviders, signIn } from 'next-auth/react';

type ProviderTypes = {
  providers: {
    google: {
      id: string;
      name: string;
      type: string;
      signinUrl: string;
      callbackUrl: string;
    };
  };
};

const signin = ({ providers }: ProviderTypes) => {
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <img
        src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/en/twitter-tips/desktop-assets/ch-01/ch11signup.png.twimg.1920.png"
        alt="twitter-phone"
        className="hidden md:inline-flex object-cover md:w-44 md:h-80 rotate-6"
      />
      <div className="">
        {Object.values(providers).map((provider, key) => {
          return (
            <div key={key} className="flex flex-col items-center">
              <img
                src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
                alt="twitter-logo"
                className="w-36 object-cover"
              />
              <p className="text-center text-sm italic my-10 ">
                This App is created for learning purposes
              </p>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
              >
                Sign in with {provider.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default signin;

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers
    }
  };
};
