import classnames from 'classnames';
import '../css/Button.css';

function Button({
    children,
    primary,
    secondary,
    rounded
}){
    const classes = classnames( {
        'secondary' : secondary,
        'rounded' : rounded
    });

    return <button className={classes}>{children}</button>
}

export default Button;