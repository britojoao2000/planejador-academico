// Função auxiliar para disparar o download de um JSON
export const downloadJson = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2); // Formata com 2 espaços
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};