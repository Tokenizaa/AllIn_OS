// Tipo para dados do CSV
export interface CSVData {
  [key: string]: string;
}

// Função para parsear o conteúdo CSV
export const parseCSV = (csvText: string): CSVData[] => {
  // Dividir o texto em linhas
  const lines = csvText.trim().split(/\r?\n/);
  
  // Se não houver linhas ou apenas cabeçalho, retornar array vazio
  if (lines.length <= 1) {
    return [];
  }
  
  // Parsear os cabeçalhos
  const headers = lines[0].split(',').map(header => {
    // Remover aspas e espaços extras
    return header.replace(/"/g, '').trim().replace(/\s+/g, '-');
  });
  
  const results = [];
  
  // Processar cada linha de dados
  for (let i = 1; i < lines.length; i++) {
    const currentline = lines[i];
    
    // Expressão regular para dividir campos CSV corretamente
    const regex = /(?<=^|,)(?:"([^"]*)"|([^,]*))/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(currentline)) !== null) {
      // Usar o grupo capturado que não é undefined
      matches.push(match[1] !== undefined ? match[1] : match[2]);
    }
    
    const obj: CSVData = {};
    
    for (let j = 0; j < headers.length; j++) {
      // Remover aspas e espaços extras dos valores
      const value = matches[j] ? matches[j].replace(/"/g, '').trim() : '';
      obj[headers[j]] = value;
    }
    
    results.push(obj);
  }
  
  return results;
};