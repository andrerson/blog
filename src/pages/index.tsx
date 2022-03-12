import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home({results, next_page}: PostPagination) {
  return (
    <>
      <Header />

      <main className={styles.content}>
        <div className={styles.posts}>

          {results.map(post => ( <a>
            <strong>{post.data.title}</strong>
            <p>{post.data.subtitle}</p>
            <div>
              <time>
                <FiCalendar width={20} height={20} /> {post.first_publication_date}
              </time>
              <label>
                <FiUser width={20} height={20} /> {post.data.author}
              </label>
            </div>
          </a>))}
        
          {next_page ? <a>Carregar mais posts</a> : ''}
        </div>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ], {
    pageSize: 20
  });

  console.log(postsResponse)


  

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(),
        post.first_publication_date,
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  // TODO
  return {
    props: {
      results: posts,
      next_page: postsResponse.next_page
    },
  };
};
