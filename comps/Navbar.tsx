import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav>
      {/* <div className="logo">
      </div> */}
      <Link href="/">Home</Link>
      <Link href="/submit">Submit</Link>
      <Link href="/ninjas/">Listing</Link>
    </nav>
  );
}
 
export default Navbar;