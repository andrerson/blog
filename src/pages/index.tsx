import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Header />

      <main className={styles.content}>
        <div className={styles.posts}>
          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <FiCalendar width={20} height={20} /> 15 Mar 2021
              </time>
              <label>
                <FiUser width={20} height={20} /> Joseph Oliveira
              </label>
            </div>
          </a>

          <a>
            <strong>Criando um app CRA do zero</strong>
            <p>
              Tudo sobre como criar a sua primeira aplicação utilizando Create
              React App
            </p>
            <div>
              <time>
                <FiCalendar width={20} height={20} /> 29 Abr 2021
              </time>
              <label>
                <FiUser width={20} height={20} /> Anderson Freitas
              </label>
            </div>
          </a>

          <a>Carregar mais posts</a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  console.log(postsResponse);

  // TODO
  return {
    props: {
      postsResponse,
    },
  };
};
