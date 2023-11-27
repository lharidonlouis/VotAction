import React from 'react';
import france from '../images/France1.jpg';

function About() {
  return (
    <div>
        <div className='row'>
            <div className='col-12'>
                <h1 className='text-center text-logo-big'>VotAction</h1>
                <hr className='bbr mt-0'/>
                <h2 className='mt-2'>Changez le monde, bureau de vote par bureau de vote</h2>
            </div>
        </div>
        <div className='row mt-5'>
            <div className='col-sm-12 col-md-6'>
            <img className='img-fluid' src={france} alt='Illustration' />
            </div>
            <div className='col-sm-12 col-md-6'>
                <h3 className='mt-2'>L'application qui vous donne une vue détaillée des résultats électoraux bureau de vote par bureau de vote</h3>
                <p>Notre application utilise les données officielles des élections, disponibles sur <a href="https://www.data.gouv.fr/fr/pages/donnees-des-elections-et-referendums/" target="_blank">www.data.gouv.fr</a>, pour vous permettre de suivre en temps réel l'évolution des résultats et vous fournir une analyse détaillée de chaque bureau de vote.</p>
                <p>Vous pouvez visualiser les résultats pour chaque candidat, les taux de participation, et bien plus encore grâce à notre interface simple et intuitive.</p>
                <p>Que vous soyez un électeur curieux ou un analyste politique, VotAction est l'application qu'il vous faut pour suivre de près les élections et mieux comprendre les tendances de vote dans votre région.</p>
                <a href="#">Essayez VotAction dès maintenant</a> et découvrez les résultats électoraux de votre région sous un nouvel angle !
            </div>
        </div>
    </div>
);
}

export default About;
