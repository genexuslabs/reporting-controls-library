export const xmlToDocument = (text: string): Document =>
  new DOMParser().parseFromString(text, "text/xml");

export const getMultipleElementsByTagName = (
  parent: Document | Element,
  name: string
) => parent.getElementsByTagName(name);

export function getSingleElementByTagName(
  parent: Document | Element,
  name: string
) {
  const nodes = getMultipleElementsByTagName(parent, name);

  return nodes.length > 0 ? nodes[0] : null;
}

export function getBooleanAttribute(
  element: Element,
  attributeName: string,
  defaultValue: boolean
): boolean {
  const value = element.getAttribute(attributeName);

  return value ? value.toLowerCase() === "true" : defaultValue;
}

export const getCharacterAttribute = (
  element: Element,
  attributeName: string,
  defaultValue: string
) => element.getAttribute(attributeName) ?? defaultValue;

export const selectXPathNode = (xmlDoc: Document, xpath: string) => {
  const nodes = xmlDoc.evaluate(
    xpath,
    xmlDoc,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  return nodes.iterateNext();
};
