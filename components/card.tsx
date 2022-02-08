import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import classnames from 'classnames';

import styles from '@/styles/Card.module.css';

interface Props {
  name: string;
  imgUrl: string;
  alt: string;
  href: string;
  className: string;
}

const Card: React.FC<Props> = (props) => {
  return (
    <Link href={props.href || ''}>
      <a className={classnames(styles.cardLink, props.className)}>
        <div className={classnames(styles.container, 'glass')}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
              alt={props.alt || 'coffee shop image'}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
