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