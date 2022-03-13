import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  // TODO
  return (
    <div className={styles.content}>
      <div>
        <Link href="/">
          <a>
            <img src="/Logo.png" alt="logo" />
          </a>
        </Link>
      </div>
    </div>
  );
}
