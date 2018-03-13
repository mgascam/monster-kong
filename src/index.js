import './style.css';
import Icon from './icon.png';

const component = () => {
    let element = document.createElement('div');

    element.innerHTML = ['Hello', 'webpack'].join(' ');
    element.classList.add('hello');

    var myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());