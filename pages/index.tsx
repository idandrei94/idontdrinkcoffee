import type { NextPage } from 'next';
import Banner from '../components/home/banner';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Card from '@/components/card';

import { Shop } from 'models/shop';

import { GetStaticProps } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import { useTrackLocation } from 'hooks/use-track-location';
import { ShopContext } from 'store/store-context';
import { GetCoffeeShops } from 'client-requests/coffee-shop';
import { GetCoffeeShops as GetShops } from 'services/airtable_api';

interface Props {
  shops: Shop[];
}

const Home: NextPage<Props> = ({ shops }) => {
  const onClick = () => {
    setIsLoading(true);
    dispatch({
      type: 'SET_SHOPS',
      payload: []
    });
    handleTrackLocation();
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, seterror] = useState<string | undefined>();

  const { handleTrackLocation, location } = useTrackLocation();
  const { state, dispatch } = useContext(ShopContext);

  useEffect(() => {
    if (state.shops.length == 0 && state.latLong) {
      GetCoffeeShops(state.latLong, 9)
        .then((res) => {
          dispatch({
            type: 'SET_SHOPS',
            payload: res
          });
          setIsLoading(false);
        })
        .catch((err) => {
          seterror(err.error);
          setIsLoading(false);
        });
    } else if (location.latLong && location.latLong !== state.latLong) {
      dispatch({
        type: 'SET_LATLONG',
        payload: location.latLong
      });
    }
  }, [state, dispatch, location.latLong, isLoading]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={onClick}
          showbutton={true}
          isLoading={location.isFindingLocation || isLoading}
        />
        {location.error && <h1>{location.error}</h1>}
        {error && <h1>{error}</h1>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>
        {state.shops && state.shops.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>{state.shops[0].city} Shops</h2>
            <div className={styles.cardLayout}>
              {state.shops.map((s) => (
                <Card
                  key={s.id}
                  alt={s.name}
                  name={s.name}
                  imgUrl={s.imgUrl}
                  href={`/coffee-shop/${s.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
        {shops && shops.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>{shops[0].city} Shops</h2>
            <div className={styles.cardLayout}>
              {shops.map((s) => (
                <Card
                  key={s.id}
                  alt={s.name}
                  name={s.name}
                  imgUrl={s.imgUrl}
                  href={`/coffee-shop/${s.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      shops: await GetShops()
    },
    revalidate: 15
  };
};

export default Home;
