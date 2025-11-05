function ProdutoPage() {
 return (
   <div className="container-fluid"
    style={{ maxWidth: "1200px", justifyContent: "center"}}>
     <div className="d-flex justify-content-between align-items-center mt-4">
       <h3>Produto</h3>
       <button className="btn btn-primary" style={{ backgroundColor:"#044CF4"}}>+ Adicionar Produto</button>
     </div>
     
     <div
        className="p-4 rounded shadow w-100 text-center mt-3"
        style={{ maxWidth: "1200px", justifyContent: "center", backgroundColor: "#FFFFFF" }}
      >
        <p className="text-secondary">Nenhum Produto cadastrado.</p>
      </div>

   </div>
 );


}


export default ProdutoPage;