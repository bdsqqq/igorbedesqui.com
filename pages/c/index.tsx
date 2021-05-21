export default function ComponentsPage() {
  const { t, lang } = useTranslation("comps/common");

  const [columns, setColumns] = useState(2);
  const initialCardNumber = 5;
  const [cardNumber, setCardNumber] = useState(initialCardNumber);
  const [cards, setCards] = useState<{ height: number; color: string }[]>([]);

  useEffect(() => {
    console.log("makeCards");
    setCards(makeCards(initialCardNumber));
  }, [initialCardNumber]);

  useEffect(() => {
    console.log("setCardNumber");
    setCardNumber(cards.length);
  }, [cards]);

  return (
    <>
      <Seo t={t} lang={lang} url="p" />
      <Container key="compsHome" backable>
        <Band headline={{ bold: "01", thin: "Animated masonry grid" }}>
          <div className="relative h-full">
            <div className="flex justify-evenly w-full">
              <div>
                <h3 className="text-center font-bold text-2xl">
                  {cardNumber} Cards
                </h3>
                <div className="flex justify-center w-full gap-16">
                  <button
                    onClick={() => {
                      setCardNumber(cards.push(makeCards(1)[0]));
                    }}
                  >
                    +1 Card
                  </button>
                  <button
                    onClick={() => {
                      setCards(removeFromCards(1, cards));
                    }}
                  >
                    -1 Card
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-center font-bold text-2xl">
                  {columns} Columns
                </h3>
                <div className="flex justify-center w-full gap-16">
                  <button
                    onClick={() => {
                      setColumns(columns + 1);
                    }}
                  >
                    +1 Column
                  </button>
                  <button
                    onClick={() => {
                      setColumns(columns - 1);
                    }}
                  >
                    -1 Column
                  </button>
                </div>
              </div>
            </div>
            <Masonry columns={columns} cards={cards} />
          </div>
        </Band>
      </Container>
    </>
  );
}

import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";

import Seo from "../../components/Seo";
import Band from "../../components/Band";
import Container from "../../components/Container";
import Masonry from "../../components/MasonryStuff/Masonry";

import {
  makeCards,
  removeFromCards,
} from "../../components/MasonryStuff/CardData";
