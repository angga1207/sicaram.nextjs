import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleTheme, toggleSemidark } from '../../store/themeConfigSlice';
import IconSettings from '../Icon/IconSettings';
import IconX from '../Icon/IconX';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';

const Calculator = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showCustomizer, setShowCustomizer] = useState(false);

    const [calculator, setCalculator] = useState({
        display: '0',
        firstValue: null,
        operator: null,
        waitingForSecondValue: false,
    });

    const handleNumber = (num: string) => {
        if (calculator.waitingForSecondValue) {
            setCalculator({
                ...calculator,
                display: num,
                waitingForSecondValue: false,
            });
        } else {
            setCalculator({
                ...calculator,
                display: calculator.display === '0' ? num : calculator.display + num,
            });
        }
    };

    return (
        <div>
            <div className={`${(showCustomizer && '!block') || ''} fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`} onClick={() => setShowCustomizer(false)}></div>

            <nav
                className={`${(showCustomizer && 'ltr:!right-0 rtl:!left-0') || ''
                    } fixed top-0 bottom-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 ltr:-right-[400px] rtl:-left-[400px] dark:bg-black`}
            >
                <button
                    type="button"
                    className="absolute tops-0 bottom-32 my-auto flex h-10 w-12 cursor-pointer items-center justify-center bg-primary text-white ltr:-left-12 ltr:rounded-tl-full ltr:rounded-bl-full rtl:-right-12 rtl:rounded-tr-full rtl:rounded-br-full"
                    onClick={() => setShowCustomizer(!showCustomizer)}
                >
                    <IconLaptop className="animate-[spin_3s_linear_infinite] w-5 h-5" />
                </button>

                <div className="perfect-scrollbar h-full overflow-y-auto overflow-x-hidden">
                    <div className="relative pb-5 text-center">
                        <button type="button" className="absolute top-0 opacity-30 hover:opacity-100 ltr:right-0 rtl:left-0 dark:text-white" onClick={() => setShowCustomizer(false)}>
                            <IconX className="w-5 h-5" />
                        </button>

                        <h4 className="mb-1 dark:text-white">
                            Kalkulator Bantuan
                        </h4>
                    </div>

                    <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
                        <h5 className="mb-1 text-base leading-none dark:text-white">
                            Kalkulator
                        </h5>

                        {/* Calculator Display */}
                        <div className="flex flex-col items-center justify-center p-3 bg-[#f7f7f7] dark:bg-[#1b2e4b] rounded-md">
                            <input
                                type="text"
                                className="w-full h-10 text-2xl text-right font-semibold bg-transparent border-none outline-none dark:text-white"
                                placeholder="0"
                            />
                        </div>

                        {/* Calculator Buttons */}
                        <div className="grid grid-cols-4 gap-1 mt-3">
                            <button type="button" className="btn btn-primary"
                                onClick={() => {
                                    handleNumber('7');
                                }}
                            >
                                7
                            </button>
                            <button type="button" className="btn btn-primary">8</button>
                            <button type="button" className="btn btn-primary">9</button>
                            <button type="button" className="btn btn-primary">/</button>

                            <button type="button" className="btn btn-primary">4</button>
                            <button type="button" className="btn btn-primary">5</button>
                            <button type="button" className="btn btn-primary">6</button>
                            <button type="button" className="btn btn-primary">*</button>

                            <button type="button" className="btn btn-primary">1</button>
                            <button type="button" className="btn btn-primary">2</button>
                            <button type="button" className="btn btn-primary">3</button>
                            <button type="button" className="btn btn-primary">-</button>

                            <button type="button" className="btn btn-primary">.</button>
                            <button type="button" className="btn btn-primary">0</button>
                            <button type="button" className="btn btn-primary">=</button>
                            <button type="button" className="btn btn-primary">+</button>

                            <button type="button" className="btn btn-primary">C</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Calculator;
