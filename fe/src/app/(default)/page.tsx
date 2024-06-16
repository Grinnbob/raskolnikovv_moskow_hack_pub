// async function getData() {
//   const categories: ICategories[] = await fetch(
//     `${process.env.api}/category`,
//   ).then((res) => res.json());

//   return { categories };
// }

export default async function Home() {
  return (
    <div className='bg-white w-full mt-12'>
      <div className='text-center'>
        <h1>Raskolnikovv</h1>
        <p className='text-primary-600 mt-2'>Помогаем найти работу</p>
      </div>
      <div className='my-10 flex justify-center  md:flex sm:justify-center md:w-full lg:flex lg:justify-between'>
        <div className='box-border p-6  max-w-[250px] w-full text-lg font-semibold text-primary-600 hidden lg:block '>
          <p className='my-6'>Здесь могла бы быть ваша реклама..</p>
        </div>
      </div>
    </div>
  );
}
