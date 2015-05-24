package chat;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Анна on 20.05.2015.
 */
public class JSONServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private List<Message> history = new ArrayList<Message>();
    private MessageExchange messageExchange = new MessageExchange();
    private Document doc;
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        try {
            File xmlFile = new File("File.xml");
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            doc = dBuilder.parse(xmlFile);
            NodeList nList = doc.getElementsByTagName("message");
            for (int i = 0; i<nList.getLength(); i++) {
                Node nNode = nList.item(i);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {

                    Element eElement = (Element) nNode;
                    String author = eElement.getElementsByTagName("author").item(0).getTextContent();
                    String text = eElement.getElementsByTagName("text").item(0).getTextContent();
                    String dateNode = eElement.getElementsByTagName("date").item(0).getTextContent();
                    System.out.println(dateNode + " " + author + " : " + text);
                    history.add(new Message(text, author));
                }
            }
        }
        catch (Exception e){}
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
        try {
            Message message = messageExchange.getClientMessage(request.getInputStream());
            MessageExchange ms = new MessageExchange();
            if (doc == null) {
                DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
                DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
                doc = docBuilder.newDocument();
                doc.appendChild(doc.createElement("messages"));
            }
            Element root = doc.getElementById("messages");
            Element messageNode = doc.createElement("message");
            Element author = doc.createElement("author");
            author.appendChild(doc.createTextNode(message.getAuthor()));
            Element text = doc.createElement("text");
            text.appendChild(doc.createTextNode(message.getText()));
            Element dateNode = doc.createElement("date");
            SimpleDateFormat dateformat = new SimpleDateFormat("MM-dd-yy HH:mm");
            Date d = new Date();
            dateNode.appendChild(doc.createTextNode(dateformat.format(d)));
            messageNode.appendChild(author);
            messageNode.appendChild(text);
            messageNode.appendChild(dateNode);
            root.appendChild(messageNode);
            history.add(message);
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            DOMSource source = new DOMSource(doc);
            StreamResult result = new StreamResult(new File("file.xml"));
            try {
                    transformer.transform(source, result);
            } catch (TransformerException ex) {
                Logger.getLogger(JsonServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
            System.out.println(dateformat.format(d) + message.getAuthor() + " : " + message.getText());
        }
        catch (ParseException e){
            System.err.println("Invalid user message: " + e.getMessage());
        }
        catch (ParserConfigurationException e) {}
        catch (TransformerConfigurationException e) {}
    }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
        try {
            ServletOutputStream stream = res.getOutputStream();
            stream.println(messageExchange.getServerResponse(history));
        }
        catch (Exception e) {}
    }
}
