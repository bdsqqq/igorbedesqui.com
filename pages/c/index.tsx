export default function ComponentsPage() {
  const { t, lang } = useTranslation("comps/common");

  const [columns, setColumns] = useState(5);
  const initialCardNumber = 20;
  const [cardNumber, setCardNumber] = useState(initialCardNumber);
  const [cards, setCards] = useState<{ height: number; color: string }[]>([]);

  useEffect(() => {
    console.log("makeCards");
    setCards(makeCards(initialCardNumber, sizes));
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
            <div className="flex flex-col md:flex-row md:justify-evenly w-full gap-16">
              <div>
                <h3 className="text-center font-bold text-2xl">
                  {cardNumber} Cards
                </h3>
                <div className="flex justify-center w-full gap-4">
                  <button
                    onClick={() => {
                      setCardNumber(cards.push(...makeCards(10, sizes)));
                    }}
                  >
                    +10 Cards
                  </button>
                  <button
                    onClick={() => {
                      setCardNumber(cards.push(...makeCards(1, sizes)));
                    }}
                  >
                    +1 Card
                  </button>
                  <button
                    onClick={() => {
                      if (cards.length > 0) {
                        setCards(removeFromCards(1, cards));
                      }
                    }}
                  >
                    -1 Card
                  </button>
                  <button
                    onClick={() => {
                      if (cards.length > 9) {
                        setCards(removeFromCards(10, cards));
                      }
                    }}
                  >
                    -10 Cards
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
                      if (columns > 1) {
                        setColumns(columns - 1);
                      }
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
import Masonry from "../../components/MasonryStuff/MasonryGrid";

import {
  sizes,
  makeCards,
  removeFromCards,
} from "../../components/MasonryStuff/CardData";
