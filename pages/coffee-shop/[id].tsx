import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/ShopDetails.module.css';
import classnames from 'classnames';
import jsonShops from '@/models/coffee-stores.json';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Shop } from '@/models/shop';
import Head from 'next/head';
import Image from 'next/image';
import { ShopContext } from 'store/store-context';
import { GetCoffeeShopById, GetCoffeeShops } from 'services/airtable_api';
import {
  upvoteCoffeeShop,
  GetCoffeeShopById as GetShopById
} from 'client-requests/coffee-shop';
import useSwr, { Fetcher } from 'swr';

interface Props {
  shop: Shop | null;
}

const fetcher: Fetcher<Shop, string> = (id) => GetShopById(id);

const CoffeeShop: React.FC<Props> = (props) => {
  const { query } = useRouter();
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  const { data } = useSwr<Shop>(id, fetcher, {
    refreshInterval: 2000,
    revalidateIfStale: true
  });

  const [shop, setshop] = useState<Shop | null>(props.shop);
  const [upvotes, setUpvotes] = useState<number | undefined>(shop?.upvotes);

  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setshop(data);
      setUpvotes(data.upvotes);
    }
  }, [data]);

  const handleUpvote = () => {
    setisLoading(true);
    upvoteCoffeeShop(shop!.id).then((_) => {
      GetShopById(shop!.id)
        .then((s) => {
          setshop(s);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setisLoading(false);
        });
    });
  };

  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (!shop) {
    return (
      <div className={styles.container}>
        <div className={styles.backToHomeLink}>
          <Link href="/">
            <a>← Back to Home</a>
          </Link>
        </div>
        <h1>Store not found ):</h1>
      </div>
    );
  }
  const { name, address, neighbourhood, imgUrl } = shop;

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={600}
            height={360}
            alt={name}
            className={styles.storeImg}
          />
        </div>
        <div className={classnames('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width={24}
              height={25}
              alt="location icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width={24}
                height={25}
                alt="location icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width={24}
              height={25}
              alt="location icon"
            />
            <p className={styles.text}>{upvotes}</p>
          </div>
          <button
            className={styles.upvoteButton}
            onClick={handleUpvote}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : 'Upvote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  return {
    paths: (await GetCoffeeShops()).map((s) => ({
      params: { id: s.id }
    })),
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context?.params?.id) {
    return {
      props: {
        shop: null
      }
    };
  }
  return {
    props: {
      shop: await GetCoffeeShopById(
        Array.isArray(context.params.id)
          ? context.params.id[0]
          : context.params.id
      )
    }
  };
};

export default CoffeeShop;
