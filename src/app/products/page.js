// "use client";
// import { useEffect, useState } from "react";
// import { Alert, Modal, Spin } from "antd";
// import styles from "../home.module.css";
// import Image from "next/image";
// import { ChevronDown } from "lucide-react";
// import CheckSignInModal from "../components/AuthenticationModal";
// import { products } from "../products";
// export default function ProductSection() {
//   const [subProducts, setSubProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [cartLoading, setCartLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [alertInfo, setAlertInfo] = useState({
//     visible: false,
//     type: "",
//     message: "",
//   });
//   useEffect(() => {
//     let timer;
//     if (alertInfo.visible) {
//       timer = setTimeout(() => {
//         setAlertInfo({ ...alertInfo, visible: false });
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [alertInfo.visible]);

//   const handleProductClick = async (product) => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/getSubProducts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ type: product.name }),
//       });
//       const data = await response.json();
//       setSubProducts(data.subProducts);
//     } catch (error) {
//       console.error("Error fetching subproducts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (productId) => {
//     const isSignedIn = sessionStorage.getItem("isSignedIn");
//     if (!isSignedIn) {
//       setIsModalOpen(false);
//       setIsModalVisible(true);
//       return;
//     }
//     setCartLoading(true);
//     try {
//       const response = await fetch("/api/addToCart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: productId,
//           userId: sessionStorage.getItem("userId"),
//         }),
//       });
//       await response.json();
//       setAlertInfo({
//         visible: true,
//         type: "success",
//         message: "Product added to cart successfully",
//       });
//       setIsModalOpen(false);
//     } catch (error) {
//       setAlertInfo({
//         visible: true,
//         type: "error",
//         message: "Failed to add product to cart",
//       });
//     } finally {
//       setCartLoading(false);
//     }
//   };
//   const handleSubProductClick = (subProduct) => {
//     setSelectedProduct(subProduct);
//     setIsModalOpen(true);
//   };

//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleQuestion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };
//   return (
//     <>
//       <section className="bg-[#efede9] sm:py-16 py-8 Helvetica">
//         <h1
//           className="text-center text-[66px] sm:text-[88px]  text-[#473a3a] font-serif mb-8"
//           style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
//         >
//           products
//         </h1>
//         <div className="flex justify-center sm:gap-8 gap-3 px-4 tracking-[0.2rem] ">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="relative w-96 cursor-pointer"
//               onClick={() => handleProductClick(product)}
//             >
//               <Image
//                 src={product.image}
//                 alt={product.name}
//                 width={384} // Width of 96 * 4 in pixels
//                 height={256} // Height of 64 * 4 in pixels
//                 className="object-cover w-full h-64"
//               />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <h2 className="text-white sm:text-lg font-medium text-center">
//                   {product.name}
//                 </h2>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//       <div className="my-16">
//         {loading ? (
//           <>
//             <div className="justify-center items-center hidden sm:flex">
//               <Spin size="large" />
//             </div>
//             <div className="justify-center items-center flex sm:hidden">
//               <Spin size="default" />
//             </div>
//           </>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-4 sm:w-[988px] mx-auto sm:gap-4 px-4 gap-3 ">
//             {subProducts.map((subProduct) => (
//               <div
//                 key={subProduct.id}
//                 className="cursor-pointer bg-white"
//                 onClick={() => handleSubProductClick(subProduct)}
//               >
//                 <Image
//                   src={subProduct.image}
//                   alt={subProduct.name}
//                   width={384} // Width of 96 * 4 in pixels
//                   height={256} // Height of 64 * 4 in pixels
//                   className="object-cover w-full h-64"
//                 />
//                 <h3 className="text-center uppercase Manrope text-[#473a3a] text-sm sm:text-base font-medium my-5 mb-1 tracking-widest">
//                   {subProduct.name}
//                 </h3>
//                 <p className="text-center text-[13px] sm:text-base text-[#473a3a] Helvetica">
//                   {subProduct.price}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <Modal
//         visible={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={999}
//         centered
//         className="products-modal"
//       >
//         {selectedProduct ? (
//           <section className="bg-[#efede9] py-8 sm:py-14 text-[#473a3a] flex flex-col-reverse sm:flex-row justify-between px-2  sm:px-20 ">
//             <div className="flex justify-between flex-col">
//               <div>
//                 <p className="uppercase tracking-widest font-semibold text-xl mb-2 Manrope">
//                   {selectedProduct.name}
//                 </p>
//                 <p className="my-3 Helvetica">{selectedProduct.description}</p>
//                 <p className="Helvetica">{selectedProduct.price}</p>
//                 {cartLoading ? (
//                   <Spin
//                     style={{
//                       marginTop: "18px",
//                       padding: "1px 0",
//                       borderColor: "#473a3a",
//                       color: "#473a3a",
//                       marginLeft: "40px",
//                     }}
//                   />
//                 ) : (
//                   <button
//                     className={`${styles.selectButton} focus-none`}
//                     onClick={() => addToCart(selectedProduct._id)}
//                     style={{
//                       marginTop: "18px",
//                       padding: "1px 17px",
//                       borderColor: "#473a3a",
//                       color: "#473a3a",
//                     }}
//                   >
//                     add to cart
//                   </button>
//                 )}
//               </div>
//               <div className="sm:w-[344px] mt-[75px]  Helvetica">
//                 {[
//                   "Product Description",
//                   "Shipping and Returns",
//                   "Care Instructions",
//                 ].map((heading, index) => (
//                   <div
//                     key={index}
//                     style={{ borderColor: "rgb(166 159 156)" }}
//                     className={`border-t-2 ${index === 2 ? "border-b-2" : ""}`}
//                   >
//                     <button
//                       className="w-full py-2 tracking-widest font-semibold flex justify-between items-center text-left"
//                       onClick={() => toggleQuestion(index)}
//                     >
//                       <span className="text-[#473a3a] text-xs uppercase">
//                         {index + 1}. {heading}
//                       </span>
//                       <ChevronDown
//                         className={`w-[17px] h-[17px] text-[#473a3a] border-[1px] rounded-full border-[#473a3a] transition-transform duration-200 ${
//                           openIndex === index ? "transform rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {openIndex === index && (
//                       <div className="pb-2  text-[#473a3a] text-[13px]">
//                         {selectedProduct?.description}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <Image
//                 src={selectedProduct.image}
//                 alt={selectedProduct.name}
//                 width={284}
//                 height={156}
//                 className="object-cover hidden sm:block"
//               />
//               <Image
//                 src={selectedProduct.image}
//                 alt={selectedProduct.name}
//                 width={184}
//                 height={56}
//                 className="object-cover mb-5 mx-auto sm:hidden"
//               />
//             </div>
//           </section>
//         ) : (
//           <Spin size="large" />
//         )}
//       </Modal>

//       <CheckSignInModal
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//       />
//       {alertInfo.visible && (
//         <Alert
//           message={alertInfo.message}
//           type={alertInfo.type}
//           closable
//           onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
//           style={{
//             position: "fixed",
//             top: "20px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             color: "black",
//           }}
//         />
//       )}
//     </>
//   );
// }


import React from 'react';

const UnderConstruction = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🚧 Under Construction 🚧</h1>
      <p>We're working hard to bring you something amazing. Stay tuned!</p>
    </div>
  );
};

export default UnderConstruction;
