import Head from 'next/head';

import NavBar from "./Navbar";

const layout=({children})=>{
    return(
        <>
            <Head> 
                <title>Knowledge Box</title>
                <link rel="icon" href="/icon.png" />
                <link rel="stylesheet" href="/style.css"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/fontawesome.min.css" integrity="sha512-OdEXQYCOldjqUEsuMKsZRj93Ht23QRlhIb8E/X0sbwZhme8eUw6g8q7AdxGJKakcBbv7+/PX0Gc2btf7Ru8cZA==" crossorigin="anonymous" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
            </Head>
            <NavBar />
            {children}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        </>
    )
}

export default layout