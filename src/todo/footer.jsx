import '../assets/styles/footer.styl';
import Spec from './spec.vue';

export default {
    data() {
        return {
            name: 'canvas'
        }
    },
    render() {
        const inputAttrs = {
            type: 'number',
            placeholder: 'please enter email'       
        }
        return (
            <div class="footer">
                <span>To you {this.name}</span>
                <Spec></Spec>
                <input {...{attrs: inputAttrs, on: {
                    input() {
                        console.log('123')
                    }
                }}}/>
            </div>
        )
    }
}