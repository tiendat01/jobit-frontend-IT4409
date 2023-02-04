import Banner from './Banner/Banner'
import Contact from './Contact/Contact'
import CVBanner from './CVBanner/CVBanner'
import Footer from './Footer/Footer'
import ListCategories from './ListCategories/ListCategories'
import ListJobs from './ListJobs/ListJobs'
// import ListNew from './New/ListNew'

export default function Home() {
  return (
    <>
      <Banner />
      <ListCategories />
      <CVBanner />
      <ListJobs />
      <Contact />
      {/* <ListNew /> */}
      <Footer />

    </>
  )
}
