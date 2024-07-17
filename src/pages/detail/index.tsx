import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoinProps } from "../home";
import styles from "./datail.module.css";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {
  const [loading, setLoading] = useState(true);
  const { cripto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinProps>();
  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd)
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };

            setCoin(resultData);
            setLoading(false);
          });
      } catch (err) {
        navigate("/");
      }
    }
  }, [cripto]);

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes...</h4>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
          className={styles.logo}
          alt=""
        />
      </section>
    </div>
  );
}
