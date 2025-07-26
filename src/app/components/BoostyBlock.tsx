const BoostyBlock = () => {
  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 mt-8 flex flex-col">
      <span>
        Подпишитесь на мой Бусти, чтобы комментировать записи
        и получать уведомления о новых заметках.
      </span>
      <a
        className="not-underlined p-4 pb-4.5 mt-4 text-center bg-[#f15f2c] hover:bg-[#d45124] text-white rounded-lg"
        href="https://boosty.to/talyguryn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Подписаться на Бусти
      </a>
    </div>
  );
};

export default BoostyBlock;
