import { Container } from "react-bootstrap";
import Footer from "../components/Footer";
import Header from "../components/Header";


function Inicio() {
  return (
    <div>
        <div class="text-center mt-5">
            <h1 class="text-primary fw-bold">NAF</h1>
            <h3>Núcleo de Apoio Contábil e Fiscal</h3>
            <div class="bg-light p-4 mt-4 w-75 mx-auto rounded">
                <Container>
                    <h3>Melhor NAF do Norte/Nordeste pela Receita Federal</h3>
                    <p class="mt-3">O Núcleo de Apoio Contábil e Fiscal (NAF) da Unifor é responsável por aprimorar o conhecimento acadêmico e prestar assistência gratuita à população por meio da orientação sobre assuntos das áreas contábil e fiscal. O atendimento é realizado por alunos e supervisionado por professores do curso de Ciências Contábeis.</p>
                </Container>
            </div>
        </div>

        <div class="container text-center mt-5">
            <h2 class="text-primary fw-bold mb-4">Atendimento Integrado</h2>

            <div class="row row-cols-2 g-4">

            <div class="col">
                <div class="bg-light p-4 rounded shadow-sm">
                    <h3>Atendimentos Realizados</h3>
                    <p class="fw-bold">+ de 4 mil</p>
                </div>
            </div>

            <div class="col">
                <div class="bg-light p-4 rounded shadow-sm">
                    <h3>Declaração de IRPF</h3>
                    <p class="fw-bold">+ de 1 mil</p>
                </div>
            </div>

            <div class="col">
                <div class="bg-light p-4 rounded shadow-sm">
                    <h3>MEIs regularizados</h3>
                    <p class="fw-bold">+ de 600</p>
                </div>
            </div>

            <div class="col">
                <div class="bg-light p-4 rounded shadow-sm">
                    <h3>Ações diferenciadas</h3>
                    <p class="fw-bold">+ de 40</p>
                </div>
            </div>
        </div>
    </div>

    <div>
        <h2 class="text-center text-primary fw-bold mt-5">Beneficios para a comunidade</h2>
        <Container>
        <p>O atendimento prestado pelo Núcleo beneficia a comunidade em geral, incluindo contribuintes, pessoas físicas, microempreendedores individuais (MEIs), entre outros. No NAF, os contribuintes têm acesso a serviços como:</p>
        </Container>

        <div class="row row-cols-2 g-4">

            <div class="col">
                <div>
                    <div class="bg-light p-4 rounded shadow-sm m-3">
                    
                    </div>
                </div>
            </div>

            <div class="col">
                <div>
                    <div class="bg-light p-4 rounded shadow-sm m-3">

                    </div>
                </div>
            </div>

            <div class="col">
                <div>
                    <div class="bg-light p-4 rounded shadow-sm m-3">

                    </div>
                </div>
            </div>

            <div class="col">
                <div>
                    <div class="bg-light p-4 rounded shadow-sm m-3">

                    </div>
                </div>
            </div>

        </div>
    </div>


    </div>
  );
}

export default Inicio;