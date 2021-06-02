// import { Modal, Button, Space } from "antd";

// const ReachableContext = React.createContext();
// const UnreachableContext = React.createContext();

// const config = ;

// export default AntDialog = ({
//     title,
//     text,
//     type
// }) => {
//   const [modal, contextHolder] = Modal.useModal();
//     useEffect(() => {
//         return (
//             {
//                 title: title,
//                 content: text,
//                 // content: (
//                 //   <>
//                 //     <ReachableContext.Consumer>
//                 //       {(name) => `Reachable: ${name}!`}
//                 //     </ReachableContext.Consumer>
//                 //     <br />
//                 //     <UnreachableContext.Consumer>
//                 //       {(name) => `Unreachable: ${name}!`}
//                 //     </UnreachableContext.Consumer>
//                 //   </>
//                 // ),
//               }
//         )
//     }, [])
//   return (
//     <ReachableContext.Provider value="Light">
//       <Space>
//         <Button
//           onClick={() => {
//             modal.confirm(config);
//           }}
//         >
//           Confirm
//         </Button>
//         <Button
//           onClick={() => {
//             modal.warning(config);
//           }}
//         >
//           Warning
//         </Button>
//         <Button
//           onClick={() => {
//             modal.info(config);
//           }}
//         >
//           Info
//         </Button>
//         <Button
//           onClick={() => {
//             modal.error(config);
//           }}
//         >
//           Error
//         </Button>
//       </Space>
//       {/* `contextHolder` should always under the context you want to access */}
//       {contextHolder}

//       {/* Can not access this context since `contextHolder` is not in it */}
//       <UnreachableContext.Provider value="Bamboo" />
//     </ReachableContext.Provider>
//   );
// };
