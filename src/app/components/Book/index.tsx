export interface BookProps {
  name: string;
  author: string;
  description?: string;
  image: string;
  textColor: string;
  backgroundColor: string;
  size: {
    height: number;
    width: number;
    thickness: number;
  };
}

const Book: React.FC<BookProps> = (book) => {
  const perspective = 1000;
  const startDeg = 10;
  const descriptionWidth = book.description ? 300 : 0;

  // const sizeCoef = 1;

  // console.log(book.size);

  // book.size.height = book.size.height * sizeCoef;
  // book.size.width = book.size.width * sizeCoef;
  // book.size.thickness = book.size.thickness * sizeCoef;

  // console.log(book.size);

  return (
    <>
      <style jsx>{`
        .book {
          width: ${book.size.thickness}px;
          height: ${book.size.height}px;
          position: relative;
          perspective: ${perspective}px;

          transition: width 0.4s ease;

          cursor: pointer;
        }

        .spine,
        .cover {
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .cover {
          border-radius: 0 4px 4px 0;
        }

        .spine {
          width: ${book.size.thickness}px;
          height: ${book.size.height}px;
          transform: rotateY(-${startDeg}deg)
            translateX(-${book.size.thickness}px);
          transform-origin: left;
          position: absolute;
          backface-visibility: hidden;
          transition: transform 0.6s ease;
          z-index: 2;
          top: 0;
          left: ${book.size.thickness}px;
        }

        .spine__text {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          color: ${book.textColor};
          padding: 30px 10px;
        }

        .spine__name {
          font-size: 18px;
          font-weight: bold;
        }

        .spine__author {
          font-size: 18px;
          font-weight: normal;
        }

        .cover {
          width: ${book.size.width}px;
          height: ${book.size.height}px;
          transform: rotateY(${90 - startDeg}deg);
          transform-origin: left;
          position: absolute;
          backface-visibility: hidden;
          transition: transform 0.6s ease;
          z-index: 1;
          background-size: cover;
          background-position: center;

          top: 0;
          left: ${book.size.thickness}px;
        }

        // .cover::before {
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   width: 100%;
        //   height: 100%;
        //   background: linear-gradient(
        //     90deg,
        //     rgba(255, 255, 255, 0) 0.5%,
        //     rgba(0, 0, 0, 0.1) 1%,
        //     rgba(0, 0, 0, 0.05) 2.5%,
        //     rgba(255, 255, 255, 0) 3%
        //   );
        // }

        .book__description {
          display: none;
        }

        .book:hover {
          width: ${book.size.width +
          book.size.thickness +
          descriptionWidth +
          20}px;
        }

        .book:hover .spine {
          transform: rotateY(-65deg) translateX(-${book.size.thickness}px);
        }

        .book:hover .cover {
          transform: rotateY(10deg);
        }

        .book:hover .book__description {
          display: block;
          position: absolute;
          top: 0;
          left: ${book.size.width + book.size.thickness}px;
          width: ${descriptionWidth}px;
          height: 100%;
          // background-color: rgba(255, 255, 255, 0.9);
          padding: 20px 10px;
          // border: 1px solid rgba(0, 0, 0, 0.1);
          z-index: 3;
        }
      `}</style>

      <div className="book">
        <div
          className="spine"
          style={{
            backgroundColor: book.backgroundColor,
            boxShadow: `0 0 10px 0 ${book.backgroundColor} inset`,
          }}
        >
          <div className="spine__text">
            <div className="spine__name">{book.name}</div>
            <div className="spine__author">{book.author}</div>
          </div>
        </div>
        <div
          className="cover"
          style={{
            backgroundColor: book.backgroundColor,
            backgroundImage: `url(${book.image})`,
            color: book.textColor,
          }}
          data-name={book.name}
        ></div>

        {book.description && (
          <div className="book__description">{book.description}</div>
        )}
      </div>
    </>
  );
};

export default Book;
