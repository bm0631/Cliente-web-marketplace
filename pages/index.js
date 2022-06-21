import Web3 from "web3";
import Web3Modal from "web3modal";
import React, { useEffect, useState } from "react";
import Marketplace from "../../build/MarketPersonalData.json";
import minterNFT from "../../build/minterNFT.json";

import "jquery";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";

import useCollapse from "react-collapsed";
/* -------------------------------------------------------------------------- */
/*                                  index.js                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------ Pagina de listado y venta ----------------------- */

export default function listNfts() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
    loadNFTs();
  }, []);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  /**
   * handleOnClick
      Controla el cerrar y abrir del desplegable de compra
   */
  function handleOnClick() {
    setExpanded(!isExpanded);
  }

  /**
   * loadNFTs
   * Funcion que recoge los datos de la red llamando a get_List_On_The_Market() del mercado y los coloca en objetos Js
   */

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();

    const marketPlaceContract = new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkId].address
    );
    const listings = await marketPlaceContract.methods
      .get_List_On_The_Market()
      .call();

    const nfts = await Promise.all(
      listings.map(async (i) => {
      

        try {
          let dataNft = JSON.parse(i.dataNft);
          let _gender;
          switch (parseInt(dataNft.personalData.gender)) {
            case 0:
              _gender = "Hombre";
              break;
            case 1:
              _gender = "Mujer";
              break;
            case 2:
              _gender = "Sin género";
              break;
          }

          let importanDataOnlyList = {
            name: dataNft.personalData.name,
            age: dataNft.personalData.age,
            gender: _gender,
            city: dataNft.home_Adrees.city,
            country: dataNft.home_Adrees.country,
            hobbies: dataNft.Data_Of_Commercial_Interest.list_Hobbiets,
            numberOfChilds: dataNft.Data_Of_Commercial_Interest.numberOfChilds,
            job: dataNft.Data_Of_Commercial_Interest.professional_Career
              .possition,
          };
          const nft = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            dataNft: importanDataOnlyList,
          };

          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState("loaded");
  }
  /**
   * buyNft
   * Funcion que se ejecuta cuando se han leido las condiciones y se ha pulsado el boton de comprar,
   * llama al metodo buy(address, tokenId) del mercado. Cuando finaliza vuelve a listar.
   * @param {*} nft: nft que ha sido selecionado para la venta
   */
  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const marketPlaceContract = new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkId].address
    );
    const accounts = await web3.eth.getAccounts();
    await marketPlaceContract.methods
      .buyNft(minterNFT.networks[networkId].address, nft.tokenId)
      .send({ from: accounts[0], value: nft.price });
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 class="cover-heading d-flex justify-content-center">
          No se encuentran datos en venta es este momento
        </h1>
        <h2 class="lead d-flex justify-content-center">
          Mantengase a la espera o disponga sus datos para la venta
        </h2>
      </div>
    );
  } else {
    return (
      <div class="container overflow-hidden">
        <div class="row gy-5">
          {nfts.map((nft, i) => (
            <div key={i} class="card col-4 .bg-info">
              <img
                src={
                  nft.dataNft.gender === "Hombre"
                    ? "/images/MALE.png"
                    : nft.dataNft.gender === "Mujer"
                    ? "/images/FEMALE.png"
                    : "/images/GENDERLESS.png"
                }
              ></img>
              <div className="p-4">
                <p className="text-2xl font-semibold">
                  <span style={{ fontWeight: "bold" }}> Nombre: </span>{" "}
                  {nft.dataNft.name}{" "}
                  <span style={{ fontWeight: "bold" }}> Edad: </span>{" "}
                  {nft.dataNft.age}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>{" Género: "}</span>
                  {nft.dataNft.gender}
                </p>
                <ul class="list-group list-group-flush">
                  <span style={{ fontWeight: "bold" }}>{"Datos: "}</span>
                  <li class="list-group-item">
                    {nft.dataNft.city + ", " + nft.dataNft.country}
                  </li>

                  <li class="list-group-item">
                    {nft.dataNft.numberOfChilds + " hijos"}
                  </li>
                  <li class="list-group-item">
                    <span style={{ fontWeight: "bold" }}>
                      {"Puesto actual: "}
                    </span>
                    {nft.dataNft.job}
                  </li>
                  <li class="list-group-item">
                    <span style={{ fontWeight: "bold" }}>{"Hobbies: "}</span>
                    {nft.dataNft.hobbies}
                  </li>
                </ul>
              </div>
              <div className="p-4 navbar-dark bg-primary rounded-3">
                <p className="text-2xl font-bold text-white">
                  {"Precio del NFT: "}
                  <span style={{ fontWeight: "bold" }}>
                    {Web3.utils.fromWei(nft.price, "wei")}{" "}
                  </span>
                  {"Wei"}
                </p>

                <div className="collapsible">
                  <div
                    className="header text-white"
                    {...getToggleProps({ onClick: handleOnClick })}
                  >
                    {isExpanded ? (
                      <span style={{ fontWeight: "bold" }}>
                        Pulse para mostrar menos informacion{" "}
                      </span>
                    ) : (
                      <span style={{ fontWeight: "bold" }}>
                        Pulse aqui para más informacion y comprar
                      </span>
                    )}
                  </div>
                  <div {...getCollapseProps()}>
                    <div className="content">
                      <p className="text-white">
                        Comprando este nft tendrá acceso más datos de{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {nft.dataNft.name}
                        </span>{" "}
                        de{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {nft.dataNft.city}
                        </span>
                        , entre ellos datos de contacto. Estos han sido cedidos
                        por el mismo para participar en acciones publicitarias.
                      </p>
                      <p className="text-white">
                        Exceptuando el Gas los eth irán al propietario de los
                        datos
                      </p>
                      <div class="cover-heading d-flex justify-content-center">
                        <button
                          type="button"
                          class="btn btn-secondary btn-lg btn-block "
                          onClick={() => buyNft(nft)}
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
