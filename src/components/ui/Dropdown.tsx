
import { useState } from 'react';
interface DropdownProps {
  setModel: (model: string) => void;
}
const Dropdown: React.FC<DropdownProps> = ({setModel}) => {
  // State to store the fetched options
  const options =[
    "qwen-2.5-coder-32b",
    "llama-3.2-1b-preview",
    "llama-guard-3-8b",
    "llama-3.2-90b-vision-preview",
    "llama-3.2-3b-preview",
    "llama3-70b-8192",
    "llama-3.2-11b-vision-preview",
    "distil-whisper-large-v3-en",
    "deepseek-r1-distill-qwen-32b",
    "gemma2-9b-it",
    "llama-3.3-70b-versatile",
    "whisper-large-v3-turbo",
    "mixtral-8x7b-32768",
    "llama3-8b-8192",
    "whisper-large-v3",
    "qwen-2.5-32b",
    "llama-3.1-8b-instant",
    "deepseek-r1-distill-llama-70b",
    "llama-3.3-70b-specdec"
]

  // State to store the selected option
  const [selectedOption, setSelectedOption] = useState('');

  // Handle dropdown change
const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedValue = event.target.value;
  setSelectedOption(selectedValue);
  setModel(selectedValue); 
};

  return (
    <div className="max-w-xs mx-auto">
      <select
        value={selectedOption}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;