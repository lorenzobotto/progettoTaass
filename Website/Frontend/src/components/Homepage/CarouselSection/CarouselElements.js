import {Carousel} from 'react-bootstrap';

export const CarouselContainer = () => {
    return (
        <Carousel>
            <Carousel.Item interval={3000} style={{maxHeight: "100vh"}}>
                <img
                className="d-block w-100"
                src={require('../../../images/1c.jpg').default}
                alt="First slide"
                />
                {/*<Carousel.Caption>
                <h3></h3>
                <p></p>
                </Carousel.Caption>*/}
            </Carousel.Item>
            <Carousel.Item interval={3000} style={{maxHeight: "100vh"}}>
                <img
                className="d-block w-100"
                src={require('../../../images/2c.jpg').default}
                alt="Second slide"
                />

                {/*<Carousel.Caption>
                <h3></h3>
                <p></p>
                </Carousel.Caption>*/}
            </Carousel.Item>
            <Carousel.Item interval={3000} style={{maxHeight: "100vh"}}>
                <img
                className="d-block w-100"
                src={require('../../../images/3c.jpg').default}
                alt="Third slide"
                />

                {/*<Carousel.Caption>
                <h3></h3>
                <p></p>
                </Carousel.Caption>*/}
            </Carousel.Item>
        </Carousel>
    )
}