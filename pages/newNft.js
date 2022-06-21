import { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";

import "jquery";
import "bootstrap/dist/css/bootstrap.css";


import Marketplace from "../../build/MarketPersonalData.json";
import minterNFT from "../../build/minterNFT.json";

  /* -------------------------------------------------------------------------- */
  /*                                  newNft.js                                 */
  /* -------------------------------------------------------------------------- */
  /* ---- Pagina que recoge datos para un nuevo token y lo pone a la venta ---- */

export default function newNft() {
  const [formInput, updateFormInput] = useState({
    _price: 1,

    _name: "",
    _lastnames: "",
    _age: 0,
    _gender: 3,

    _email: "",
    _phoneNumber: "",

    _city: "",
    _country: "",
    _floor: "",
    _street: "",

    _possition: "",
    _salary: "",
    _studies: "",

    _list_Hobbiets: "",
    _numberOfChilds: 0,
  });
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  

  /**
   * mint_and_List_Nft
   *  Recoge los datos y los dispone en objeto Js y luego en JSON,
   * comprueba si los obligatorios estan completados y procede a emitir el token.
   * Llama a metodo mint de minteNFT y a add_NFT_to_Market de MarketPersonalData.
   * Cuando empieza el proceso de emision limpia la pagina para no generar inconcluencias.
   */

  async function mint_and_List_Nft() {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    
    const networkId = await web3.eth.net.getId();

    const minterNFT_address = minterNFT.networks[networkId].address;

    const minterNFTContract = new web3.eth.Contract(
      minterNFT.abi,
      minterNFT_address
    );
    const accounts = await web3.eth.getAccounts();
    const marketPlaceContract = new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkId].address
    );

      if(parseInt(formInput._price)<=0){
        alert("El precio debe ser superior a 0");
        return ;
      }
      if( formInput._name==="" ||formInput._lastnames==="" || formInput._email=="" ||formInput._phoneNumber==""){
        alert("Faltan datos obligatorios(*), por favor rellene la mayor cantidad posible");
        return ;
      }



    let _pesonalData = {
      name: formInput._name,
      lastnames: formInput._lastnames,
      age: formInput._age,
      gender: document.getElementById("genderValue").value,
    };
    let _home_Adrees = {
      city: formInput._city,
      country: formInput._country,
      floor: formInput._floor,
      street: formInput._street,
    };
    let _contactData = {
      email: formInput._email,
      phoneNumber: formInput._phoneNumber,
    };
    let _professional_Career = {
      possition: formInput._possition,
      salary: formInput._salary,
      studies: formInput._studies,
    };
    let _Data_Of_Commercial_Interest = {
      list_Hobbiets: formInput._list_Hobbiets,
      numberOfChilds: formInput._numberOfChilds,
      professional_Career: _professional_Career,
    };
    let _dataNft = {
      personalData: _pesonalData,
      home_Adrees: _home_Adrees,
      contactData: _contactData,
      Data_Of_Commercial_Interest: _Data_Of_Commercial_Interest,
    };

    minterNFTContract.methods
      .mint()
      .send({ from: accounts[0] })
      .on("receipt", function (receipt) {
        alert("NFT acuñado, espere a que salte otro mensaje en MetaMask para añadirlo al MarketPlace");
        
        const tokenId = receipt.events.NFTMinted.returnValues[0];
        marketPlaceContract.methods
          .add_NFT_to_Market(
            minterNFT_address,
            tokenId,
            formInput._price,
            JSON.stringify(_dataNft)
          )
          .send({ from: accounts[0] });
      });
    document
      .getElementById("main")
      .removeChild(document.getElementById("child"));
    document.getElementById("main").innerHTML =
      '<div><h1 class="cover-heading d-flex justify-content-center">Emitiendo y poniendo en mercado su NFT</h1><h6 class="cover-heading d-flex justify-content-center"> por favor acepte los pasos en Metamask y al terminar pulse: <div><b>INICIO o Nfts emitidos por usted</b></div></h6></div>';
  }

  return (
    <div id="main">
      <div id="child">
        <div>
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <span style={{ fontWeight: "bold" }}>Datos personales</span>
                </button>
              </h2>

              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
                style={{ margin: "2%" }}
              >
                <div class="row ">
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                      <span style={{ fontWeight: "bold",color: "#A23436" }}>*</span>Nombre:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({ ...formInput, _name: e.target.value })
                      }
                    />
                  </div>
                  <div class="col">
                    <div>
                      <label for="validationCustom01" class="form-label">
                      <span style={{ fontWeight: "bold",color: "#A23436" }}>*</span>Apellidos:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _lastnames: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Edad:
                      </label>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      requiered
                      min="1"
                      max="130"
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({ ...formInput, _age: e.target.value })
                      }
                    />
                  </div>
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Género:
                      </label>
                    </div>

                    <select
                      class="form-control"
                      id="genderValue"
                      required
                      autocomplete="off"
                    >
                      <option value="0">Hombre</option>
                      <option value="1">Mujer</option>
                      <option value="2">Sin género</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <span style={{ fontWeight: "bold" }}>
                    Direcciones de contacto
                  </span>
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
                style={{ margin: "2%" }}
              >
                <div class="row ">
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                      <span style={{ fontWeight: "bold",color: "#A23436" }}>*</span>Email:
                      </label>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                      <span style={{ fontWeight: "bold",color: "#A23436" }}>*</span>Teléfono móvil:
                      </label>
                    </div>
                    <input
                      type="tel"
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  <span style={{ fontWeight: "bold" }}>Direcciones</span>
                </button>
              </h2>
              <div
                id="collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
                style={{ margin: "2%" }}
              >
                <div class="row ">
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        País:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _country: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Ciudad:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div class="row " style={{ marginTop: "2%" }}>
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Calle:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _street: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Piso:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _floor: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFour">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                >
                  <span style={{ fontWeight: "bold" }}>
                    Información laboral
                  </span>
                </button>
              </h2>
              <div
                id="collapseFour"
                class="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#accordionExample"
                style={{ margin: "2%" }}
              >
                <div class="row ">
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Puesto actual:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _possition: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Salario actual:
                      </label>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      requiered
                      min="0"
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _salary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Diploma de estudios de mayor rango:
                      </label>
                    </div>
                    <input
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _studies: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFive">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFive"
                  aria-expanded="false"
                  aria-controls="collapseFive"
                >
                  <span style={{ fontWeight: "bold" }}>Datos extra</span>
                </button>
              </h2>
              <div
                id="collapseFive"
                class="accordion-collapse collapse"
                aria-labelledby="headingFive"
                data-bs-parent="#accordionExample"
                style={{ margin: "2%" }}
              >
                <div class="row ">
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Liste y/o descríbalos sus hobbies:
                      </label>
                    </div>
                    <textarea
                      className="form-control"
                      requiered
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _list_Hobbiets: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div class="col ">
                    <div>
                      <label for="validationCustom01" class="form-label">
                        Número de hijos:
                      </label>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      requiered
                      min="0"
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          _numberOfChilds: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div><p><small> <span style={{ fontWeight: "bold",color: "#A23436" }}>* Indica los datos obligatorios</span></small></p></div>
        <div
          className="cover-heading d-flex justify-content-center"
          style={{ marginTop: "2%" }}
        >
          <label for="validationCustom01" className="form-label ">
            Precio en wei:
          </label>
        </div>
        <div className="cover-heading d-flex justify-content-center">
          <input
            type="number"
            className="form-control"
            requiered
            min="1"
            max="999999999999"
            style={{ width: "15%" }}
            onChange={(e) =>
              updateFormInput({
                ...formInput,
                _price: e.target.value,
              })
            }
          />
        </div>
        <div
          className="cover-heading d-flex justify-content-center"
          style={{ margin: "2%" }}
        >
          <small>
            <small>
              Emitiendo estos datos, las empresas podrán comprarlos y contactar
              con usted en campañas publicitarias. A cambio de esto, cada vez
              que se vendan sus datos, a una nueva empresa, sele realizara un
              ingreso según ha especificado (Wei){" "}
            </small>
          </small>
        </div>
        <div
          className="cover-heading d-flex justify-content-center"
          style={{ margin: "2%" }}
        >
          <button
            class="btn btn-secondary btn-lg btn-block"
            onClick={mint_and_List_Nft}
          >
            Emitir Nft y poner a la venta
          </button>
        </div>
      </div>
    </div>
  );
}
