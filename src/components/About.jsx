import { version } from '../../package.json';

const About = () => {
    return (
        <div className="prose">
            <h2>About</h2>
            <p>
                After trying out the <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique">Pomodoro Technique</a>, I found it hard to
                stick to the set start and stop times when I found my way into
                the flow state, so I searched for a simple tool to just remind
                me of the time and ended up building one to suite my needs.
            </p>

            <p>This project is open source and available on <a href="https://github.com/devjusty/time-reminder">GitHub</a>.</p>

            <p>
                Created by <a href="https://justy.dev">Justin Thompson</a>
            </p>

            <p>
                If you find this project useful and would like to support it,
                consider{' '}
                <a href="https://buymeacoffee.com/justydev">
                    buying me a coffee
                </a>
            </p>
            <p>Version {version}</p>
        </div>
    );
};

export default About;
