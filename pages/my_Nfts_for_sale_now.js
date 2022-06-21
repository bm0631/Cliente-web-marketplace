import Web3 from "web3";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";

import Marketplace from "../../build/MarketPersonalData.json";

import "jquery";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";

  /* -------------------------------------------------------------------------- */
  /*                           my_Nfts_for_sale_now.js                          */
  /* -------------------------------------------------------------------------- */
  /* ------- Pagina que lista los NFTs que has emitido y siguen en venta ------ */


export default function myNftsForsaleNow() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
    loadNFTs();
  }, []);

  
 /**
   * loadNFTs
   * Funcion que recoge los datos de la red llamando a getMyNftsForsaleNow() del un address concreto y los coloca en objetos Js
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
    const accounts = await web3.eth.getAccounts();
    const listings = await marketPlaceContract.methods
      .getMyNftsForsaleNow()
      .call({ from: accounts[0] });
      
    const nfts = await Promise.all(
      listings.map(async (i) => {
        let dataNft=JSON.parse(i.dataNft);
        try {
          let _gender;
          switch (
            parseInt(dataNft.personalData.gender)
          ) {
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
          let _pesonalData = {
            name: dataNft.personalData.name,
            lastnames: dataNft.personalData.lastnames,
            age: dataNft.personalData.age,
            gender: _gender,
          };
          let _home_Adrees = {
            city: dataNft.home_Adrees.city,
            country: dataNft.home_Adrees.country,
            floor: dataNft.home_Adrees.floor,
            street: dataNft.home_Adrees.street,
          };
          let _contactData = {
            email: dataNft.contactData.email,
            phoneNumber: dataNft.contactData.phoneNumber,
          };
          let _professional_Career = {
            possition:
              dataNft.Data_Of_Commercial_Interest.professional_Career
                .possition,
            salary:
              dataNft.Data_Of_Commercial_Interest.professional_Career.salary,
            studies:
              dataNft.Data_Of_Commercial_Interest.professional_Career.studies,
          };
          let _Data_Of_Commercial_Interest = {
            list_Hobbiets: dataNft.Data_Of_Commercial_Interest.list_Hobbiets,
            numberOfChilds:
              dataNft.Data_Of_Commercial_Interest.numberOfChilds,
            professional_Career: _professional_Career,
          };
          let _dataNft = {
            personaData: _pesonalData,
            home_Adrees: _home_Adrees,
            contactData: _contactData,
            Data_Of_Commercial_Interest: _Data_Of_Commercial_Interest,
          };
          const nft = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            dataNft: _dataNft,
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

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 class="cover-heading d-flex justify-content-center">
        {"Actualmente, no se vende ningún dato emitido por usted"}
        </h1>
        <h2 class="lead d-flex justify-content-center">
          {"Puede emitir datos para su venta pulsando: "}{" "}
          <span style={{ fontWeight: "bold" }}>{"Vender un nuevo dato"}</span>
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
                  nft.dataNft.personaData.gender === "Hombre"
                    ? "/images/MALE.png"
                    : nft.dataNft.personaData.gender === "Mujer"
                    ? "/images/FEMALE.png"
                    : "/images/GENDERLESS.png"
                }
              ></img>
              <div className="p-4">
                <p className="text-2xl font-semibold">
                  <span style={{ fontWeight: "bold" }}> Nombre: </span>{" "}
                  {nft.dataNft.personaData.name}{" "}
                  {nft.dataNft.personaData.lastnames}
                  <span style={{ fontWeight: "bold" }}> Edad: </span>{" "}
                  {nft.dataNft.personaData.age}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>{" Género: "}</span>
                  {nft.dataNft.personaData.gender}
                </p>
                <ul class="list-group list-group-flush">
                  <span style={{ fontWeight: "bold" }}>{"Dirección: "}</span>
                  <li class="list-group-item">
                    {nft.dataNft.home_Adrees.street +
                      " " +
                      nft.dataNft.home_Adrees.floor}
                  </li>
                  <li class="list-group-item">
                    {nft.dataNft.home_Adrees.city +
                      ", " +
                      nft.dataNft.home_Adrees.country}
                  </li>
                </ul>

                <ul class="list-group list-group-flush">
                  <span style={{ fontWeight: "bold" }}>{"Contacto: "}</span>
                  <li class="list-group-item">
                    <span style={{ fontWeight: "bold" }}> Email: </span>
                    {nft.dataNft.contactData.email}
                  </li>

                  <li class="list-group-item">
                    <span style={{ fontWeight: "bold" }}> Tlf: </span>{" "}
                    {nft.dataNft.contactData.phoneNumber}
                  </li>
                </ul>

                <ul class="list-group list-group-flush">
                  <span style={{ fontWeight: "bold" }}>
                    {"Datos comerciales: "}
                  </span>
                  <li class="list-group-item">
                    <span style={{ fontWeight: "bold" }}>Hobbiets: </span>
                    {nft.dataNft.Data_Of_Commercial_Interest.list_Hobbiets}
                  </li>

                  <li class="list-group-item">
                    {nft.dataNft.Data_Of_Commercial_Interest.numberOfChilds +
                      " hijos"}
                  </li>
                </ul>
                <ul class="list-group list-group-flush">
                  <span style={{ fontWeight: "bold" }}>
                    {"Datos laborales actuales: "}
                  </span>
                  <li class="list-group-item">
                    <span style={{ fontWeight: "bold" }}>Puesto: </span>
                    {
                      nft.dataNft.Data_Of_Commercial_Interest
                        .professional_Career.possition
                    }
                  </li>

                  <li class="list-group-item">
                    <span style={{ fontWeight: "bold" }}>Salario: </span>
                    {nft.dataNft.Data_Of_Commercial_Interest.professional_Career
                      .salary + "€"}
                  </li>
                </ul>
                <ul class="list-group list-group-flush">
                  <span style={{ fontWeight: "bold" }}>{"Estudios: "}</span>
                  <li class="list-group-item">
                    {
                      nft.dataNft.Data_Of_Commercial_Interest
                        .professional_Career.studies
                    }
                  </li>
                </ul>
              </div>
              <div className="p-4 navbar-dark bg-primary rounded-3">
                <p className="text-2xl font-bold text-white">
                  {"Precio de venta que establecio usted para el NFT: "}
                  <span style={{ fontWeight: "bold" }}>
                    {Web3.utils.fromWei(nft.price, "wei")}{" "}
                  </span>
                  {"Wei"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
