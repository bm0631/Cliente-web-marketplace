import "../styles/globals.css";
import Link from "next/link";
import "jquery";
import "bootstrap/dist/css/bootstrap.css";

import { useEffect } from "react";


/* -------------------------------------------------------------------------- */
/*                                   _app.js                                  */
/* -------------------------------------------------------------------------- */
/* ---------------------- Pagina de barra de navegacion --------------------- */

/** 
  Pagina que presentan el navBar para navegar por las demas paginas y usando Link permite incorporar estas paginas debajo del nav 
  sin repetir codigo.

  Paginas:
    index.js(/): lista todos los NFTs en venta y permite comprarlos 
    my_Minted:Nfts.js: lista los NFTs que has emitido
    my_Nfts_for_sale_now.js: lista los NFTs que has emitido y siguen en venta actualmente
    newNfts.js: recoge datos para emitir un nuevo token y lo pone a la venta
    nft_on_my_property.js: lista los nft que posees actualmente y permite ponerlos otra vez a la venta
*/

function PersonalDataApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img
              src={"/images/iconNavbar.png"}
              width="76"
              height="50"
              alt="PERSONAL DATA MARKET"
            ></img>
            <h6>
              <small>
                <small>
                  <small>
                    <small>
                      <small>PERSONAL DATA MARKET</small>
                    </small>
                  </small>
                </small>
              </small>
            </h6>
          </a>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <li class="nav-item">
                <Link href="/">
                  <a className="nav-link active " aria-current="page">
                    INICIO
                  </a>
                </Link>
              </li>
              <li class="nav-item">
                <Link href="/newNft">
                  <a class="nav-link">Vender un nuevo dato</a>
                </Link>
              </li>
              <li class="nav-item">
                <Link href="/nft_on_my_property">
                  <a class="nav-link">Mis datos en posesión</a>
                </Link>
              </li>
              <li class="nav-item">
                <Link href="/my_Nfts_for_sale_now">
                  <a class="nav-link">Mis datos a la venta</a>
                </Link>
              </li>
              <li class="nav-item">
                <Link href="/my_Minted_Nfts">
                  <a class="nav-link " aria-current="page">
                    Nfts emitidos por usted
                  </a>
                </Link>
                </li>
            </div>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </div>
  );
}

export default PersonalDataApp;
