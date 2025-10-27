import MainLayout from './components/layouts/Main';

export default function NotFound() {
  return (
    <MainLayout>
      <section>
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          Страница не найдена
        </h1>
        <p className="">
          Если вы считаете, что это ошибка, пожалуйста, сообщите мне об этом.
        </p>
        <p className="">
          Скажу, что{' '}
          <a className="text-blue-500 underlined" href="/">
            главная страница
          </a>{' '}
          точно существует, и вы можете поискать нужную информацию там.
        </p>
      </section>
    </MainLayout>
  );
}
