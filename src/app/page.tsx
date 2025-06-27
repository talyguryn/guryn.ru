export default async function Page() {
  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <p>
          Пишите в{' '}
          <a
            href="https://t.me/guryn"
            target="_blank"
            className="underline underline-offset-[0.2em] decoration-[0.015em] hover:underline-offset-[0.3em] transition-all"
          >
            Телеграм
          </a>
        </p>
      </div>
    </>
  );
}
