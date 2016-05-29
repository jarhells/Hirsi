/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hirsiserver;


import java.rmi.server.UID;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class WordsContainer {

    static Map<Integer, String> words = Collections.synchronizedMap(new HashMap<Integer, String>(1000));
    
    boolean isInitialised = false;
    Random rand;

    
    public WordsContainer() {
        init();
    }

    
    private void init()
    {
        synchronized(this)
        {
            if(!isInitialised)
            {
                words.put(new UID().hashCode(), "LENTOKONE");
                words.put(new UID().hashCode(), "AUTO");
                words.put(new UID().hashCode(), "MANSIKKA");
                words.put(new UID().hashCode(), "KUHA");
                words.put(new UID().hashCode(), "PÄIVÄNKAKKARA");
                words.put(new UID().hashCode(), "ILVES");
                words.put(new UID().hashCode(), "JÄÄKIEKKO");
                words.put(new UID().hashCode(), "VADELMA");
                words.put(new UID().hashCode(), "MUSTIKKA");
                words.put(new UID().hashCode(), "JATKOAIKA");
                words.put(new UID().hashCode(), "JALKAPALLO");
                words.put(new UID().hashCode(), "SEINÄKELLO");
                words.put(new UID().hashCode(), "SOHVA");
                words.put(new UID().hashCode(), "NOJATUOLI");
                words.put(new UID().hashCode(), "MOOTTORIVENE");
                words.put(new UID().hashCode(), "LASAGNE");
                words.put(new UID().hashCode(), "SILITYSRAUTA");
                words.put(new UID().hashCode(), "SINIVUOKKO");
                words.put(new UID().hashCode(), "TALITIAINEN");
                words.put(new UID().hashCode(), "MAKARONILAATIKKO");
                words.put(new UID().hashCode(), "KENGURU");
                words.put(new UID().hashCode(), "PINGVIINI");
                words.put(new UID().hashCode(), "PAPPA");
                words.put(new UID().hashCode(), "SATEENVARJO");
                words.put(new UID().hashCode(), "KESÄLOMA");

                rand = new Random(System.nanoTime());
                
//                words.entrySet().stream().forEach((entry) ->
//                {
//                    System.out.println("entry: " + entry.hashCode() + " " + entry.getValue());
//                });

                System.out.println("WordsContainer initialized, " + words.size() + " words.");
                isInitialised = true;
            }
        }
    }

    
    public int getWordsCount()
    {
        return words.size();
    }
    
    
    public int getRandomWordId()
    {
        List<Integer> ids = new ArrayList(words.keySet());
        return ids.get(rand.nextInt(words.size()));
    }
    
    public String getWord(int id){
        return words.get(id);
    }


    public int getWordLength(int id){
        return words.get(id).length();
    }
}
