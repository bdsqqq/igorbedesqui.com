type ShellProps = {
  t: Translate;
  initialCardAmount?: number;
  initialColumnNumber?: number;
  cardNumberControls?: boolean;
  columnNumberControls?: boolean;
};

const Shell: React.FC<ShellProps> = ({
  t,
  initialColumnNumber,
  initialCardAmount,
  cardNumberControls,
  columnNumberControls,
}) => {
  const [columns, setColumns] = useState(initialColumnNumber ?? 5);
  const initialCardNumber = initialCardAmount ?? 20;
  const [cardNumber, setCardNumber] = useState(initialCardNumber);
  const [cards, setCards] = useState<{ height: number; color: string }[]>([]);

  useEffect(() => {
    setCards(makeCards(initialCardNumber, sizes));
  }, [initialCardNumber]);

  useEffect(() => {
    setCardNumber(cards.length);
  }, [cards]);

  return (
    <div className="relative h-full">
      <div className="flex flex-wrap flex-col md:flex-row md:justify-evenly w-full gap-16">
        {cardNumberControls && (
          <CardNumberControls
            t={t}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cards={cards}
            setCards={setCards}
          />
        )}
        {columnNumberControls && (
          <ColumnNumberControls
            t={t}
            columns={columns}
            setColumns={setColumns}
          />
        )}
      </div>
      <Masonry columns={columns} cards={cards} />
    </div>
  );
};

const CardNumberControls: React.FC<{
  t: Translate;
  cards: { height: number; color: string }[];
  setCards: React.Dispatch<
    SetStateAction<
      {
        height: number;
        color: string;
      }[]
    >
  >;
  cardNumber: number;
  setCardNumber: React.Dispatch<SetStateAction<number>>;
}> = ({ t, cards, setCards, cardNumber, setCardNumber }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cardNumber);
  }, [cardNumber]);

  return (
    <div>
      <h3 className="text-center font-bold text-2xl">
        {count + " " + t("card", { count })}
      </h3>
      <div className="flex justify-center w-full gap-4">
        <button
          onClick={() => {
            setCardNumber(cards.push(...makeCards(10, sizes)));
          }}
        >
          +10 {t("card.other")}
        </button>
        <button
          onClick={() => {
            setCardNumber(cards.push(...makeCards(1, sizes)));
          }}
        >
          +1 {t("card.one")}
        </button>
        <button
          onClick={() => {
            if (cards.length > 0) {
              setCards(removeFromCards(1, cards));
            }
          }}
        >
          -1 {t("card.one")}
        </button>
        <button
          onClick={() => {
            if (cards.length > 9) {
              setCards(removeFromCards(10, cards));
            }
          }}
        >
          -10 {t("card.other")}
        </button>
      </div>
    </div>
  );
};

const ColumnNumberControls: React.FC<{
  t: Translate;
  columns: number;
  setColumns: React.Dispatch<SetStateAction<number>>;
}> = ({ t, columns, setColumns }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(columns);
  }, [columns]);

  return (
    <div>
      <h3 className="text-center font-bold text-2xl">
        {count + " " + t("column", { count })}
      </h3>
      <div className="flex justify-center w-full gap-16">
        <button
          onClick={() => {
            setColumns(columns + 1);
          }}
        >
          +1 {t("column.one")}
        </button>
        <button
          onClick={() => {
            if (columns > 1) {
              setColumns(columns - 1);
            }
          }}
        >
          -1 {t("column.one")}
        </button>
      </div>
    </div>
  );
};

export default Shell;

import { SetStateAction, useEffect, useState } from "react";
import { Translate } from "next-translate";

import Masonry from "./MasonryGrid";
import { sizes, makeCards, removeFromCards } from "./CardData";
