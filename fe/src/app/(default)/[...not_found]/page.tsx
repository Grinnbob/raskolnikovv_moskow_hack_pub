import ButtonLink from '@web/shared/ui/links/ButtonLink';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-white mt-20'>
        <div className='flex  flex-col items-center justify-center text-center text-black'>
          <h1 className='mt-8 text-4xl md:text-6xl'>Page Not Found</h1>
          <ButtonLink variant='dark' href='/' className='mt-5'>
            Back to home
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
