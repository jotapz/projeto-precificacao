function PrecificacaoPage() {
 return (
   <div className="container-fluid"
    style={{ maxWidth: "1200px", justifyContent: "center"}}>
     <div className="">
       <h3>Calculadora de Preços</h3>
       <p>Calcule o  preço de venda sugerido pelos seus produtos</p>
     </div>

     <div
        className="p-3 rounded shadow w-100 text-start"
        style={{ maxWidth: "600px", justifyContent: "center", backgroundColor: "#eed379ff" }}
      >
        <p style={{ marginBottom: "0" }}>Você precisa cadastrar matérias-primas antes de criar produtos</p>
        <p style={{ marginBottom: "0" }}>Vá para a aba “Matéria-Prima para começar.</p>
      </div>

   </div>
 );


}


export default PrecificacaoPage;