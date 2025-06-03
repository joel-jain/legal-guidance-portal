import { FileText, Download, Search } from 'lucide-react';
import { useState } from 'react';

interface Template {
  name: string;
  url: string;
  category: string;
  lastUpdated: string;
}

const DocumentTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const templates: Template[] = [
    { 
      name: 'FIR Template', 
      url: '/templates/fir-template.docx',
      category: 'Legal Complaint',
      lastUpdated: '2023-10-15'
    },
    { 
      name: 'Rent Agreement', 
      url: '/templates/rent-agreement.docx',
      category: 'Property',
      lastUpdated: '2023-09-28'
    },
    { 
      name: 'Will Format', 
      url: '/templates/will-format.docx',
      category: 'Estate Planning',
      lastUpdated: '2023-11-02'
    },
    { 
      name: 'Consumer Complaint', 
      url: '/templates/consumer-complaint.docx',
      category: 'Consumer Rights',
      lastUpdated: '2023-08-19'
    },
    { 
      name: 'Divorce Petition', 
      url: '/templates/divorce-petition.docx',
      category: 'Family Law',
      lastUpdated: '2023-10-30'
    },
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Document Templates</h1>
          <p className="text-gray-600 mt-2">
            Ready-to-use legal document templates for various purposes
          </p>
        </div>
        
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            <div className="p-5">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mt-1">
                    {template.category}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Updated: {new Date(template.lastUpdated).toLocaleDateString()}
                </span>
                <a
                  href={template.url}
                  download
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentTemplates;