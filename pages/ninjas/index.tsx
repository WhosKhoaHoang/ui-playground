import styles from '../../styles/Ninjas.module.css'
import Link from 'next/link'

export const getStaticProps = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await res.json();

  return {
    props: { ninjas: data }
  }
}

const Ninjas = ({ ninjas }) => {
  // console.log(ninjas)

  return (
    <div>
      {ninjas.map(ninja => (
        <Link className={styles.btn} href={'/ninjas/' + ninja.id} key={ninja.id}>
          <h3>{ ninja.name }</h3>
        </Link>
      ))}
    </div>
  );
}
 
export default Ninjas;