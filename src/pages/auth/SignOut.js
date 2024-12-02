import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    signOut({
      redirect: false, 
    }).then(() => {
      router.push('/auth/SignIn'); 
    });
  }, [router]);

  return (
    <div>
      <h1>Sign out...</h1>
    </div>
  );
};

export default SignOutPage;