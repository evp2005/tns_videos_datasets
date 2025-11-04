import { Select } from 'antd';

// Configuración de opciones
const FUENTE_OPTIONS = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'vimeo', label: 'Vimeo' },
    { value: 'local', label: 'Archivo Local' },
    { value: 'url', label: 'URL Directa' },
    { value: 'drive', label: 'Google Drive' },
];

const IDIOMA_OPTIONS = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' },
    { value: 'fr', label: 'Francés' },
    { value: 'de', label: 'Alemán' },
    { value: 'pt', label: 'Portugués' },
    { value: 'it', label: 'Italiano' },
    { value: 'ja', label: 'Japonés' },
    { value: 'ko', label: 'Coreano' },
];

// Componente base para selects
const BaseSelect = ({ 
    label, 
    options, 
    onChange, 
    defaultValue, 
    placeholder, 
    allowClear = false,
    ...props 
}) => {
    const handleChange = (value) => {
        onChange?.(value);
        console.log(`${label} seleccionado: ${value}`);
    };

    return (
        <div>
            <label className='block text-sm font-medium text-gray-900 mb-3'>
                {label}
            </label>
            <Select
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={handleChange}
                options={options}
                allowClear={allowClear}
                style={{ width: '100%' }}
                {...props}
            />
        </div>
    );
};

// Componente específico para Fuentes de Video
export const FuenteSelect = ({ onChange, defaultValue, ...props }) => (
    <BaseSelect
        label="Fuente"
        options={FUENTE_OPTIONS}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder="Selecciona una fuente"
        allowClear
        {...props}
    />
);

// Componente específico para Idiomas
export const IdiomaSelect = ({ onChange, defaultValue = 'es', ...props }) => (
    <BaseSelect
        label="Idioma Origen"
        options={IDIOMA_OPTIONS}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder="Selecciona un idioma"
        {...props}
    />
);

export default Select;