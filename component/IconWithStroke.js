import { Svg, Path } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';

export default function IconWithStroke(props) {
    const size = props.size;
    const strokeWidth = 2;
    return (
        <Svg height={size} width={size}>
            <Path
                d="M0 0h20v20H0z"
                strokeWidth="2"
                fill="none"
            />
            <AntDesign
                name="like2"
                size={size - strokeWidth * 2}
                color="#FF6C00"
                style={{ position: 'absolute', top: strokeWidth, left: strokeWidth }}
            />
        </Svg>
    );
}