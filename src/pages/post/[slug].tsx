import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  // TODO
  const router = useRouter();
  const text = post.data.content.reduce((text, post) => {
    return text + RichText.asText(post.body);
  }, '');

  const timeReadText = Math.ceil(text?.split(' ').length / 200);

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Header />
      <main className={`${styles.content} ${commonStyles.content}`}>
        <img src={post.data.banner.url} alt="banner" />

        {!post.data.title && <h1>Carregando...</h1>}

        <article>
          <h1>{post.data.title}</h1>

          <div className={styles.author}>
            <time>
              <FiCalendar />{' '}
              {format(new Date(post.first_publication_date), 'd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
            <label>
              <FiUser /> {post.data.author}
            </label>
            <time>
              <FiClock /> {timeReadText} min
            </time>
          </div>

          {post.data.content.map(postContet => (
            <div className={styles.post} key={postContet.heading}>
              <h2>{postContet.heading}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(postContet.body),
                }}
              ></div>
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  // TODO
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'posts',
    `${context.params.slug}`,
    {}
  );

  const contentPosts = response.data.content.map(post => {
    return {
      heading: post.heading,
      body: post.body,
    };
  });

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: contentPosts,
    },
    uid: response.uid,
  };

  // TODO
  return {
    props: { post },
    revalidate: 10, // 10 In seconds
  };
};
